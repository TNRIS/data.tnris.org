import { Card, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../atoms/mapAtoms";
import {
  hideLayer,
  showLayer,
} from "../utilities/mapHelpers/layerVisibilityHelpers";

export function MapLayer({
  label,
  sourceId,
  source,
  layer,
  defaultVisibility = false,
}) {
  const map = useRecoilValue(mapAtom);
  const [visible, setVisible] = useState(defaultVisibility);
  useEffect(() => {
    if (map) {
      const srcCopy = { ...source };
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, srcCopy);
      }
      if (!map.getLayer(layer.id) && map.getSource(sourceId)) {
        map.addLayer({
          ...layer,
          layout: { visibility: defaultVisibility ? "visible" : "none" },
        });
      }
    }
  }, [map, defaultVisibility, layer, source, sourceId]);

  return (
    <Card size="small" focusable={false}>
      <Row justify="space-between">
        <span style={{ paddingRight: ".5rem" }}>{label}</span>
        <Switch
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={visible}
          onChange={(v) => {
            if (v) {
              setVisible(v);
              showLayer(layer.id, map);
            } else {
              setVisible(v);
              hideLayer(layer.id, map);
            }
          }}
        />
      </Row>
    </Card>
  );
}
