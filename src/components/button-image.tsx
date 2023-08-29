import Link from 'next/link';
import { FC } from 'react';

interface myprops {
  url: string;
  text: string;
  img: string;
}

export const ButtonImage: FC<myprops> = ({ url, text, img }) => {
  return (
    <>
      <div className="row gobrad m-4">
        <div className="text-center">
          <Link href={url}>
            <img src={img} className="gobimg" />
          </Link>
        </div>
        <div className="text-center pgobcl">
          <p>
            <Link href={url}>{text}</Link>
          </p>
        </div>
      </div>
    </>
  );
};
