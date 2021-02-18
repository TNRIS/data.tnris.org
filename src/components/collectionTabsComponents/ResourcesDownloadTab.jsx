import { List, Tabs } from "antd";
import { ResourcesListItem } from "./ResourcesListItem";

export function ResourcesDownloadsTab({ resources }) {
  function sortFn(a, b) {
    return a.area_type_id === b.area_type_id
      ? a.resource_type_name > b.resource_type_name
        ? -1
        : 1
      : a.area_type_id > b.area_type_id
      ? 1
      : -1;
  }

  const counties = [...resources.counties.results].sort((a, b) => sortFn(a, b));
  const quads = [...resources.quads.results].sort((a, b) => sortFn(a, b));
  const qquads = [...resources.qquads.results].sort((a, b) => sortFn(a, b));


  const renderFunction = (r) =>{
    let store = [];

    return r.map((curr, i) => {
      const next = i < r.length - 1 ? r[i + 1] : null;

      if (next && next.area_type_id === curr.area_type_id) {
        store.push(curr);
      } else {
        const temp = [...store, curr]
        store = []
        return (
          <ResourcesListItem
            key={store.toString()}
            areaTypeId={curr.area_type_id}
            resources={temp}
          />
        );
      }
      return null
    });
}
  return (
    <Tabs>
      <Tabs.TabPane tab="QQuad" key="0" disabled={resources.qquads.count < 1}>
        <List
          split
          bordered={true}
          itemLayout="vertical"
        >
          {renderFunction(qquads)}
        </List>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Quad" key="1" disabled={resources.quads.count < 1}>
      <List
          split
          bordered={true}
          itemLayout="vertical"
        >
          {renderFunction(quads)}
        </List>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab="County"
        key="2"
        disabled={resources.counties.count < 1}
      >
       <List
          split
          bordered={true}
          itemLayout="vertical"
        >
          {renderFunction(counties)}
        </List>
      </Tabs.TabPane>
    </Tabs>
  );
}
