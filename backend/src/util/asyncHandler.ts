import { Request, Response, NextFunction, RequestHandler} from 'express';

//expressの非同期ルートハンドラーやミドルウェアで発生するエラーをキャッチし、
//next関数を呼び出してエラーハンドリングを委譲するためのユーティリティ関数。
//Expressではエラーを適切に処理するために、エラーが発生した場合にnext(err)を呼び出す必要がある。
//しかし、非同期関数を使用すると、awaitで例外がスローされた場合にエラーがPromiseの中に閉じ込められ、
//next(err)が自動的に呼び出されないことがある。
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
