const BUFFER_SIZE = 256;

let utf8LengthBuffer: Uint8Array;

export function getUtf8Length(text: string): number {
  let length = 0;
  let read = 0;
  let enc = new TextEncoder();
  utf8LengthBuffer ??= new Uint8Array(BUFFER_SIZE);
  while (read < text.length) {
    const p = enc.encodeInto(text.slice(read), utf8LengthBuffer);
    read += p.read!;
    length += p.written!;
  }
  return length;
}
