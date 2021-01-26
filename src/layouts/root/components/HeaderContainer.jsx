import { PageHeader } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useHistory } from "react-router-dom";

export function HeaderContainer(props) {
  const history = useHistory();

  return (
    <div {...props}>
      <Header></Header>
      <PageHeader
        onBack={ () => console.log(history.goBack)}
        title={"Dynamic Title Goes Here on every page"}
      />
    </div>
  );
}
