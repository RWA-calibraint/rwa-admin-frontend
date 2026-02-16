import './styles.scss';
import Image from 'next/image';

import Button from '../Button/Button';

import { errorInterface } from './error.interface';

export default function ErrorPage({ errorTitle, errorDescription }: errorInterface) {
  return (
    <div className="errorContainer">
      <Image src="/404.svg" alt="404" width={232} height={154} />
      <div className="errorContent">
        <p className="errorTitle">{errorTitle}</p>
        <p className="errorMessage">{errorDescription}</p>
      </div>
      <Button className="homeButton">Take me home</Button>
    </div>
  );
}
