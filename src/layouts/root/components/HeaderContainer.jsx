import { PageHeader } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useHistory, useLocation } from "react-router-dom";

export function HeaderContainer(props) {
  const location = useLocation();
  const history = useHistory();

  return (
    <div {...props}>
      <Header></Header>
      <PageHeader
        onBack={ location.pathname !== "/" ? () => history.goBack() : null}
        title={"Dynamic Title Goes Here on every page"}
      />
    </div>
  );
}
