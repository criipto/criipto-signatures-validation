import { PayloadViewer, JwtPayload } from '@criipto/jwt-viewer';
import '@criipto/jwt-viewer/dist/criipto-jwt-viewer.css';

interface Props {
  payload: JwtPayload;
}
export default function JwtPayloadViewer(props: Props) {
  return <PayloadViewer payload={props.payload} className="p-3 border rounded max-w-screen-md" />;
}
