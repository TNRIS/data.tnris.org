import { PageHeader } from "antd";
import { Header } from "antd/lib/layout/layout";

export function HeaderContainer(props) {
  return (
    <div {...props}>
      <Header></Header>
      <PageHeader title={"Dynamic Title Goes Here on every page"} />
    </div>
  );
}
