import IndexPage from "@/components/art-gallery/index-page/IndexPage";
import "./page.module.css";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header open={1} />
      <div style={{marginTop: 60}}>
        <IndexPage />
      </div>
    </div>
  );
}
