import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  sayHello(): string {
    const awaitfunc = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Callback!');
          resolve;
        }, 3000);
      });
    };

    const a = async () => {
      await awaitfunc();
    };
    a();

    return '';
  }
}
