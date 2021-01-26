import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { FooterContainer } from "./containers/FooterContainer";
import { HeaderContainer } from "./containers/HeaderContainer";
import { RootRouter } from "./routers/RootRouter";

export function RootLayout() {
    return (
        <Layout id="Main-Layout">
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
    )
}