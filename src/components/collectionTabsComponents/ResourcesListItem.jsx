import { List } from "antd";

export function ResourcesListItem({ areaTypeId, resources }) {
  return (
    <List.Item className={"ResourceListItem"}>
      <h3>{areaTypeId}</h3>
      {resources.map((resource, i) => (
        <div key={resource.resource_id + i}>
          <a href={resource.resource}>{resource.resource_type_name}</a>
        </div>
      ))}
    </List.Item>
  );
}
