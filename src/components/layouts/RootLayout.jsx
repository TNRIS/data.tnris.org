import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { BrowserRouter } from "react-router-dom";
import { RootRouter } from "../../routers/RootRouter";
import { FooterContainer } from "../FooterContainer";
import { HeaderContainer } from "../HeaderContainer";

export function RootLayout() {
  return (
    <BrowserRouter>
      <Layout id="MainLayout">
        {/**Header contained in header grid-area */}
        <HeaderContainer className="header" />
        {/** Content contained in content grid-area */}
        <Content className="content" style={{ height: "100%" }}>
          {/** Root instance of React Router Switch Router */}
          <RootRouter />
        </Content>
        {/** Footer contained in footer grid-area */}
        <FooterContainer className="footer" />
      </Layout>
    </BrowserRouter>
  );
}
