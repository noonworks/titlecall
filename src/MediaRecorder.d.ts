declare class MediaRecorder {
  constructor(stream: MediaStream, options?: { mimeType: string });
  start(): void;
  stop(): void;
  ondataavailable: (event: MediaRecorderDataAvailableEvent) => void;
}

declare interface MediaRecorderDataAvailableEvent extends Event {
  data: any;
}
