import { Handler, HandlerEvent } from '@netlify/functions';
import busboy from 'busboy';
import {validate, Validation} from '@library';

type ValidationResponse = {
  [key: string]: Validation | {error: string}
}

const handler: Handler = async (event, context) => {
  const files = await parseMultipartForm(event);
  if (!files) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'No files in request body'})
    }
  }

  const response : ValidationResponse = {};
  await Promise.all(Object.keys(files).map(async key => {
    const file = files[key];
    try {
      response[key] = await validate(file);
    } catch (err: unknown) {
      if (err instanceof Error) {
        response[key] = {error: err.toString()}
        return;
      }
      response[key] = {error: "Unknown error occurred"};
    }
  }));

  return {
    statusCode: 400,
    body: 'Not implemented yet'
  };
}

export { handler }

type Files = {
  [key: string]: Buffer
};
async function parseMultipartForm(event: HandlerEvent): Promise<Files | null> {
  if (!event.body) return null;
  if (!event.headers['Content-Type']?.includes('multipart/form-data')) return null;

  return await new Promise((resolve) => {
    const fields : Files = {};
    const bb = busboy({ headers: event.headers });

    bb.on('file', (name, file, info) => {
      let buffer = Buffer.from([]);
      file.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
      });
      file.on('end', () => {
        fields[name] = buffer;
      });
    });

    bb.on('close', () => {
      resolve(fields);
    });

    bb.end(Buffer.from(event.body!, 'base64'));
  });
}