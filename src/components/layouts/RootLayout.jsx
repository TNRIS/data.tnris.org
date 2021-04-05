import { Drawer, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { BrowserRouter } from "react-router-dom";
import { useRecoilState } from "recoil";
import { RootRouter } from "../../routers/RootRouter";
import { cartOpenAtom } from "../../utilities/atoms/cartAtoms";
import { FooterContainer } from "../FooterContainer";
import { CartForm } from "../forms/cartForms/CartForm";
import { HeaderContainer } from "../headerComponents/HeaderContainer";

export function RootLayout() {
  const [cartOpen, setCartOpen] = useRecoilState(cartOpenAtom)

  return (
    <BrowserRouter>
      <Layout id="MainLayout">
        {/**Header contained in header grid-area */}
        <HeaderContainer className="header" />
        {/** Content contained in content grid-area */}
        <Content className="content" style={{ height: "100%" }}>
          {/** Root instance of React Router Switch Router */}
          <RootRouter />
          <Drawer
            width={window.innerWidth < 1000 ? "90%" : "40%"}
            placement="right"
            closable
            onClose={ () => setCartOpen(false) }
            visible={cartOpen}
            getContainer={false}
            style={{ position: "absolute" }}
            title="Data Shopping Cart"
          >
            <CartForm />
          </Drawer>
        </Content>
        {/** Footer contained in footer grid-area */}
        <FooterContainer className="footer" />
      </Layout>
    </BrowserRouter>
  );
}
