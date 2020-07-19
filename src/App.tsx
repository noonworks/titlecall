import React from 'react';
import './App.css';
import FaceEditor, { Face } from './components/molecules/FaceEditor';

type AppProps = {};

type AppState = {
  length: number;
  title: string;
  previewing: boolean;
  canDL: boolean;
  downloadUrl: string;
  fileName: string;
  recording: boolean;
  showCopyright: boolean;
  editors: React.RefObject<FaceEditor>[];
};

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 360;

const FACE_WIDTH = 150;
const FACE_HEIGHT = 270;

const DEFAULT_TITLE = 'エフエフジューヨン殺人事件';

const MAX_SCALE = 8;

const MSEC_BEFORE = 500;
const MSEC_FACE = 2200;
const MSEC_FADE = 800;
const MSEC_STOP = 3000;
const MSEC_AFTER = 500;
const MSEC_WHOLE = MSEC_BEFORE + MSEC_FACE + MSEC_FADE + MSEC_STOP + MSEC_AFTER;

const COPYRIGHT = 'Copyright (C) SQUARE ENIX CO., LTD. All Rights Reserved.';

const DEFAULT_LENGTH = 8;

type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function grayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    // const v = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = v; // red
    data[i + 1] = v; // green
    data[i + 2] = v; // blue
  }
}

function easeInCubic(x: number): number {
  return x * x * x;
}

function calculateFadeRatio(elapsed: number): number {
  if (elapsed <= MSEC_BEFORE || elapsed > MSEC_WHOLE - MSEC_AFTER) {
    return -100;
  } else if (elapsed <= MSEC_BEFORE + MSEC_FACE) {
    return 0;
  } else if (elapsed > MSEC_BEFORE + MSEC_FACE + MSEC_FADE) {
    return 101;
  } else {
    const ratio = (elapsed - MSEC_FACE) / MSEC_FADE;
    return easeInCubic(ratio) * 100;
  }
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      length: DEFAULT_LENGTH,
      title: '',
      previewing: false,
      canDL: false,
      downloadUrl: '',
      fileName: '',
      recording: false,
      showCopyright: true,
      editors: Array.from({ length: DEFAULT_LENGTH }).map((_) =>
        React.createRef<FaceEditor>()
      ),
    };
    this.handleMemberLengthChange = this.handleMemberLengthChange.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleClickPreview = this.handleClickPreview.bind(this);
    this.handleChangeCopyright = this.handleChangeCopyright.bind(this);
    this.animate = this.animate.bind(this);
  }

  private canvasPreview: HTMLCanvasElement | null = null;
  private ctxPreview: CanvasRenderingContext2D | null = null;
  private canvasFace: HTMLCanvasElement | null = null;
  private ctxFace: CanvasRenderingContext2D | null = null;
  private canvasTitle: HTMLCanvasElement | null = null;
  private ctxTitle: CanvasRenderingContext2D | null = null;

  private startTime = -1;
  private prevFadeRatio = -1;
  private frameStartTime = -1;

  private gifjs: GIF | null = null;
  private dlImage = document.createElement('img');

  componentDidMount() {
    this.canvasPreview = document.querySelector(
      '#Preview-Canvas'
    ) as HTMLCanvasElement;
    if (this.canvasPreview)
      this.ctxPreview = this.canvasPreview.getContext('2d');
    this.canvasFace = document.querySelector(
      '#Preview-Canvas-Cache-Face'
    ) as HTMLCanvasElement;
    if (this.canvasFace) this.ctxFace = this.canvasFace.getContext('2d');
    this.canvasTitle = document.querySelector(
      '#Preview-Canvas-Cache-Title'
    ) as HTMLCanvasElement;
    if (this.canvasTitle) this.ctxTitle = this.canvasTitle.getContext('2d');
  }

  faceListClass(): string {
    if (this.state.length <= 4) {
      return 'FaceList-Max4';
    }
    if (this.state.length <= 6) {
      return 'FaceList-Max3';
    }
    if (this.state.length <= 8) {
      return 'FaceList-Max4';
    }
    return 'FaceList-Max5';
  }

  faceList(): JSX.Element[] {
    return Array.from({ length: this.state.length }, (_, k) => k).map((key) => (
      <FaceEditor
        ref={this.state.editors[key]}
        width={FACE_WIDTH}
        height={FACE_HEIGHT}
        key={key.toString()}
      />
    ));
  }

  handleChangeCopyright() {
    this.setState((state) => ({
      showCopyright: !state.showCopyright,
    }));
  }

  handleMemberLengthChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return;
    let length = parseInt(e.target.value);
    if (length < 2) length = 2;
    if (length > 8) length = 8;
    this.setState((state) => {
      if (length < state.editors.length) {
        return { length, editors: state.editors.slice(0, length) };
      } else if (length > state.editors.length) {
        const editors: React.RefObject<FaceEditor>[] = state.editors.slice();
        for (let i = state.editors.length; i < length; i++)
          editors.push(React.createRef<FaceEditor>());
        return { length, editors };
      }
      return { length, editors: state.editors.slice() };
    });
  }

  handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value || '';
    this.setState({ title });
  }

  handleClickPreview() {
    if (!this.canvasPreview || !this.canvasFace || !this.canvasTitle) return;
    // キャッシュ描画
    this.drawFaceList();
    this.drawTitle();
    // 録画開始
    this.gifjs = new GIF({
      workerScript: 'js/gif.worker.js',
      quality: 10,
      workers: 2,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });
    // 描画開始
    this.startTime = new Date().getTime();
    this.frameStartTime = -1;
    this.prevFadeRatio = -1;
    requestAnimationFrame(this.animate);
    // ステート更新
    this.setState({
      previewing: true,
      downloadUrl: '',
      fileName: '',
      canDL: false,
      recording: true,
    });
  }

  addFrame(now: number): void {
    if (!this.ctxPreview || !this.gifjs) return;
    if (this.frameStartTime <= 0) {
      this.frameStartTime = now;
      return;
    }
    const delay = now - this.frameStartTime;
    this.gifjs.addFrame(this.ctxPreview, { copy: true, delay });
    this.frameStartTime = now;
  }

  saveGif(): void {
    if (!this.gifjs) return;
    const me = this;
    this.gifjs.on('finished', function (blob: Blob) {
      const url = URL.createObjectURL(blob);
      me.dlImage.src = url;
      me.setState({
        downloadUrl: url,
        fileName: (me.state.title || 'titlecall') + '.gif',
        canDL: true,
        recording: false,
      });
    });
    this.gifjs.render();
  }

  animate(): void {
    if (this.startTime < 0) return;
    const now = new Date().getTime();
    const elapsed = now - this.startTime;
    // アニメーション終了
    if (elapsed > MSEC_WHOLE) {
      // フレーム追加
      this.addFrame(now);
      // 保存
      this.saveGif();
      return;
    }
    // アニメーション
    const fadeRatio = calculateFadeRatio(elapsed);
    //console.log(fadeRatio);
    // フレームに変更があった場合、実際に描画
    if (this.prevFadeRatio !== fadeRatio) {
      // 前回フレームをGIFに追加
      this.addFrame(now);
      // 描画
      this.drawFrame(fadeRatio);
      // キャッシュの値を更新
      this.prevFadeRatio = fadeRatio;
    }
    requestAnimationFrame(this.animate);
  }

  drawFrame(fadeRatio: number): void {
    if (
      !this.ctxPreview ||
      !this.ctxFace ||
      !this.ctxTitle ||
      !this.canvasPreview ||
      !this.canvasFace ||
      !this.canvasTitle
    )
      return;
    // black
    if (fadeRatio < 0) {
      this.ctxPreview.fillStyle = 'rgb(0, 0, 0)';
      this.ctxPreview.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }
    // face
    this.ctxPreview.globalAlpha = 1;
    this.ctxPreview.drawImage(this.canvasFace, 0, 0);
    if (fadeRatio < 1) return;
    // title
    if (fadeRatio > 100) {
      this.ctxPreview.drawImage(this.canvasTitle, 0, 0);
      return;
    }
    // scaled title
    const ratio = fadeRatio * 0.01;
    this.ctxPreview.globalAlpha = ratio + 0.1;
    const scale = MAX_SCALE - ratio * (MAX_SCALE - 1);
    const w = CANVAS_WIDTH * scale;
    const h = CANVAS_HEIGHT * scale;
    const x = ((w - CANVAS_WIDTH) / 2) * -1;
    const y = ((h - CANVAS_HEIGHT) / 2) * -1;
    this.ctxPreview.drawImage(
      this.canvasTitle,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      x,
      y,
      w,
      h
    );
  }

  getFaceCanvases(): Face[] {
    if (this.state.length !== this.state.editors.length) return [];
    return this.state.editors.map((e) => {
      if (!e.current) return { canvas: null, died: false };
      return e.current.getFace();
    });
  }

  getTitle(): string {
    return '「' + (this.state.title || DEFAULT_TITLE) + '」';
  }

  calculatePosition(faces: Face[]): Position[] {
    let h: number;
    let w: number;
    let _y = 0;
    if (faces.length < 5) {
      // 1段組 ... width基準
      w = CANVAS_WIDTH / (faces.length + 1);
      h = (FACE_HEIGHT * w) / FACE_WIDTH;
      _y = (CANVAS_HEIGHT - h) / 2;
    } else {
      // 2段組 ... height基準
      h = CANVAS_HEIGHT / 2;
      w = (FACE_WIDTH * h) / FACE_HEIGHT;
    }
    const create = (x: number, y: number): Position[] =>
      Array.from({ length: x }).map((_, i) => ({
        x: (CANVAS_WIDTH - w * x) / 2 + (w + 1) * i,
        y: y + _y,
        w,
        h,
      }));
    const ret: Position[] = [];
    switch (faces.length) {
      case 8:
        ret.unshift(...create(4, h + 1));
        ret.unshift(...create(4, 0));
        break;
      case 7:
        ret.unshift(...create(3, h + 1));
        ret.unshift(...create(4, 0));
        break;
      case 6:
        ret.unshift(...create(3, h + 1));
        ret.unshift(...create(3, 0));
        break;
      case 5:
        ret.unshift(...create(2, h + 1));
        ret.unshift(...create(3, 0));
        break;
      case 4:
        ret.unshift(...create(4, 0));
        break;
      case 3:
        ret.unshift(...create(3, 0));
        break;
      case 2:
        ret.unshift(...create(2, 0));
        break;
    }
    return ret;
  }

  drawFaceList(): void {
    if (!this.ctxFace) return;
    // get faces
    const faces = this.getFaceCanvases();
    if (faces.length !== this.state.length) return;
    // calculate positions
    const pos = this.calculatePosition(faces);
    if (pos.length !== this.state.length) return;
    // clear back
    this.ctxFace.fillStyle = 'rgb(0, 0, 0)';
    this.ctxFace.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // draw grayscale
    for (let i = 0; i < faces.length; i++) {
      if (!faces[i].died) continue;
      const c = faces[i].canvas;
      if (!c) continue;
      const p = pos[i];
      this.ctxFace.drawImage(
        c,
        0,
        0,
        FACE_WIDTH,
        FACE_HEIGHT,
        p.x,
        p.y,
        p.w,
        p.h
      );
    }
    // grayscale filter
    const img = this.ctxFace.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grayscale(img.data);
    this.ctxFace.putImageData(img, 0, 0);
    // black filter
    this.ctxFace.globalAlpha = 0.5;
    this.ctxFace.fillStyle = 'rgb(0, 0, 0)';
    this.ctxFace.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctxFace.globalAlpha = 1;
    // draw color
    for (let i = 0; i < faces.length; i++) {
      if (faces[i].died) continue;
      const c = faces[i].canvas;
      if (!c) continue;
      const p = pos[i];
      this.ctxFace.drawImage(
        c,
        0,
        0,
        FACE_WIDTH,
        FACE_HEIGHT,
        p.x,
        p.y,
        p.w,
        p.h
      );
    }
    // copyright
    if (this.state.showCopyright) this.drawCopyright();
  }

  drawCopyright(): void {
    if (!this.ctxFace) return;
    this.ctxFace.font =
      "12px 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif";
    this.ctxFace.textAlign = 'center';
    this.ctxFace.lineWidth = 5;
    this.ctxFace.strokeStyle = '#FFFFFF';
    this.ctxFace.globalAlpha = 0.5;
    this.ctxFace.strokeText(COPYRIGHT, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 4);
    this.ctxFace.lineWidth = 3;
    this.ctxFace.strokeStyle = '#000000';
    this.ctxFace.globalAlpha = 0.8;
    this.ctxFace.strokeText(COPYRIGHT, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 4);
    this.ctxFace.fillStyle = '#FFFFFF';
    this.ctxFace.globalAlpha = 1;
    this.ctxFace.fillText(COPYRIGHT, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 4);
  }

  getFont(fontSize: number): string {
    return (
      'bold ' +
      fontSize +
      "px 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif"
    );
  }

  getTextSize(ctx: CanvasRenderingContext2D, title: string): number {
    let fontSize = Math.floor(CANVAS_WIDTH / (title.length - 2));
    while (true) {
      ctx.font = this.getFont(fontSize);
      const w = ctx.measureText(title).width;
      if (w < CANVAS_WIDTH) break;
      fontSize--;
    }
    return fontSize;
  }

  drawTitle(): void {
    if (!this.ctxTitle) return;
    const title = this.getTitle();
    const fontSize = this.getTextSize(this.ctxTitle, title);
    this.ctxTitle.fillStyle = 'rgb(0, 0, 0)';
    this.ctxTitle.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctxTitle.fillStyle = 'rgb(255, 255, 255)';
    this.ctxTitle.font = this.getFont(fontSize);
    this.ctxTitle.textAlign = 'center';
    this.ctxTitle.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  render() {
    return (
      <div className="App">
        <div className="GeneralControls">
          <table className="GeneralControls-ControlTable">
            <tbody>
              <tr>
                <th>
                  <label htmlFor="num_of_suspects">人数</label>
                </th>
                <td>
                  <input
                    type="number"
                    id="num_of_suspects"
                    min="2"
                    max="8"
                    value={String(this.state.length)}
                    onChange={this.handleMemberLengthChange}
                  />
                  <span>（2～8人）</span>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="text_title">タイトル</label>
                </th>
                <td>
                  <input
                    type="text"
                    id="text_title"
                    placeholder="エフエフジューヨン殺人事件"
                    value={this.state.title}
                    onChange={this.handleChangeTitle}
                  />
                </td>
              </tr>
              {/* <tr>
                <th>
                  <label htmlFor="num_of_file">ファイル</label>
                </th>
                <td>
                  <input type="number" id="num_of_file" min="1" max="99" />
                </td>
              </tr> */}
              <tr>
                <td></td>
                <td>
                  <label id="GeneralControls-Copyright">
                    <input
                      type="checkbox"
                      checked={this.state.showCopyright}
                      onChange={this.handleChangeCopyright}
                    />
                    FFXIV権利表記を挿入する
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={'FaceList ' + this.faceListClass()}>
          {this.faceList()}
        </div>
        <div className="Preview-Area">
          <button
            className="Preview-Button"
            onClick={this.handleClickPreview}
            disabled={this.state.recording}
          >
            生成
          </button>
          <canvas
            id="Preview-Canvas"
            style={{ display: this.state.previewing ? 'block' : 'none' }}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          ></canvas>
          <canvas
            id="Preview-Canvas-Cache-Face"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          ></canvas>
          <canvas
            id="Preview-Canvas-Cache-Title"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          ></canvas>
          <a
            id="Preview-Canvas-Download-Link"
            style={{ display: this.state.canDL ? 'inline' : 'none' }}
            href={this.state.downloadUrl}
            download={this.state.fileName}
          >
            GIFをダウンロード
          </a>
        </div>
      </div>
    );
  }
}

export default App;
