type Props = string | number | boolean | undefined | null;

interface ObjectLike {
  [key: string]: Props;
}

export function classes(...args: Array<ObjectLike | Props>) {
  const arr =
    args.length > 1
      ? args
      : Object.entries(args[0] || {}).map(([key, val]) => (!!val ? key : ''));

  return arr
    .filter(Boolean)
    .join(' ')
    .trim();
}
