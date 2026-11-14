import type {Metadata} from "next";
import "./studio.css";
export const metadata: Metadata = {
  title: "Composio Video Studio",
  description: "Online Remotion video editor",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="vi"><body>{children}</body></html>;
}
