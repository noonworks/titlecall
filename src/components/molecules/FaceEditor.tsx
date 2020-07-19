import React from 'react';
import './FaceEditor.css';
import AvatarEditor from 'react-avatar-editor';

type FaceEditorProps = {
  image?: string | File;
  width: number;
  height: number;
};

type FaceEditorState = {
  image: string | File;
  scale: number;
  died: boolean;
};

export type Face = {
  canvas: HTMLCanvasElement | null;
  died: boolean;
};

class FaceEditor extends React.Component<FaceEditorProps, FaceEditorState> {
  private editor: React.RefObject<AvatarEditor>;

  constructor(props: FaceEditorProps) {
    super(props);
    this.state = {
      image: this.props.image || '',
      scale: 1,
      died: false,
    };
    this.handleDiedCheck = this.handleDiedCheck.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.editor = React.createRef<AvatarEditor>();
  }

  handleDiedCheck(): void {
    this.setState((state) => ({ died: !state.died }));
  }

  handleNewImage(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!e.target) return;
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    this.setState({ image: files[0] });
  }

  handleDeleteImage(): void {
    this.setState({ image: '' });
  }

  handleScale(e: React.ChangeEvent<HTMLInputElement>): void {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  }

  public getImage(): HTMLCanvasElement | null {
    if (!this.editor.current) return null;
    try {
      return this.editor.current.getImage();
    } catch (ex) {
      return null;
    }
  }

  public getImageScaledToCanvas(): HTMLCanvasElement | null {
    if (!this.editor.current) return null;
    try {
      return this.editor.current.getImageScaledToCanvas();
    } catch (ex) {
      return null;
    }
  }

  public getFace(): Face {
    return {
      canvas: this.editor.current?.getImageScaledToCanvas() || null,
      died: this.state.died,
    };
  }

  render() {
    return (
      <div className="FaceEditor">
        <AvatarEditor
          ref={this.editor}
          className={
            'FaceEditor-Canvas' + (this.state.died ? ' FaceEditor-Died' : '')
          }
          image={this.state.image}
          scale={this.state.scale}
          width={this.props.width}
          height={this.props.height}
          border={0}
        />
        <div className="FaceEditor-Controls FaceEditor-Controls-Top">
          <label>
            <input
              className="FaceEditor-Controls-Died"
              type="checkbox"
              checked={this.state.died}
              onChange={this.handleDiedCheck}
            />
            死
          </label>
          <label>
            画像
            <input
              type="file"
              accept="image/*"
              onChange={this.handleNewImage}
            />
          </label>
          <label
            className="FaceEditor-Controls-Delete"
            onClick={this.handleDeleteImage}
          >
            ×
          </label>
        </div>
        <div className="FaceEditor-Controls FaceEditor-Controls-Bottom">
          <input
            type="range"
            className="FaceEditor-Controls-Scale"
            step="0.01"
            min="1"
            max="2"
            value={this.state.scale}
            onChange={this.handleScale}
          />
        </div>
      </div>
    );
  }
}

export default FaceEditor;
