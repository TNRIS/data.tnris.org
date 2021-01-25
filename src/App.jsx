//package imports
import { Layout } from "antd";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//local imports
import "./App.less";
import { CatalogCollectionRouterContainer } from "./components/containers/CatalogCollectionRouterContainer";
import { FooterContainer } from "./components/containers/FooterContainer";
import { HeaderContainer } from "./components/containers/HeaderContainer";
import CartRoute from "./components/routes/CartRoute";

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout id="Main-Layout">
        {/**Header contained in header grid-area */}
        <HeaderContainer className="header" />
        {/** Content contained in content grid-area */}
        <Content className="content" style={{ height: "100%" }}>
          <BrowserRouter>
            <Switch>
              <Route path="/cart" component={CartRoute} />
              <Route path="/*">
                <CatalogCollectionRouterContainer />
              </Route>
            </Switch>
          </BrowserRouter>
        </Content>
        {/** Footer contained in footer grid-area */}
        <FooterContainer className="footer" />
      </Layout>
    </div>
  );
}

export default App;
