import { DeleteFilled, EditFilled } from "@ant-design/icons";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import { Button, message } from "antd";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { geoSearchSelectionAtom } from "../../../atoms/geofilterAtoms";
import { drawControlsAtom, mapAtom } from "../../../atoms/mapAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";

export function GeoFilterDrawToggle() {
  const history = useHistory();
  const search = useLocation().search;

  //////////////////////////////////////
  ////Recoil State//////////////////////
  //////////////////////////////////////
  const MAP = useRecoilValue(mapAtom);
  const [DRAW_MODE, SET_DRAW_MODE] = useRecoilState(drawControlsAtom);
  const SET_SEARCH_SELECTION = useSetRecoilState(geoSearchSelectionAtom);

  //////////////////////////////////////
  ////Local State///////////////////////
  //////////////////////////////////////
  const [IS_DRAW_MODE, SET_IS_DRAW_MODE] = useState(false);

  //////////////////////////////////////
  ////Effects///////////////////////////
  //////////////////////////////////////

  //Initialize draw controls to map atom if not existing
  useEffect(() => {
    if (MAP && !DRAW_MODE) {
      let modes = MapboxDraw.modes;
      modes.draw_rectangle = DrawRectangle;
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        modes: modes,
        controls: {
          simple_select: false,
          draw_rectangle: false,
          trash: false,
        },
      });
      MAP.addControl(draw);
      SET_DRAW_MODE(draw);
    }
    if (MAP && DRAW_MODE) {
      const drawLayerFn = (layer) => {
        history.push({
          search: changeParams(
            [
              {
                key: "geo",
                value: bbox(layer.features[0].geometry),
                ACTION: "set",
              },
            ],
            search
          ),
        });
        const v = {
          bbox: bbox(layer.features[0].geometry),
          properties: {
            display_name: "Custom search boundary",
          },
        };
        document.getElementsByClassName("mapboxgl-canvas")[0].style.cursor =
          "unset";
        SET_SEARCH_SELECTION(v);
        DRAW_MODE.deleteAll();
      };
      // Add drawLayerFn to listeners
      MAP.on("draw.create", drawLayerFn);
      MAP.on("draw.update", drawLayerFn);

      // Remove listeners on cleanup
      return () => {
        MAP.off("draw.create", drawLayerFn);
        MAP.off("draw.update", drawLayerFn);
      };
    }
  }, [MAP, DRAW_MODE, SET_DRAW_MODE, SET_SEARCH_SELECTION, history, search]);

  useEffect(() => {
    return () => {
      if (IS_DRAW_MODE) {
        DRAW_MODE.deleteAll();
      }
    };
  }, [DRAW_MODE, IS_DRAW_MODE]);

  return (
    <b>
      {!IS_DRAW_MODE ? (
        <Button
          icon={<EditFilled />}
          onClick={() => {
            if (MAP && DRAW_MODE) {
              message.info(
                "Click once, drag, then twice to create a bounding box",
                4
              );
              document.getElementsByClassName(
                "mapboxgl-canvas"
              )[0].style.cursor = "crosshair";
              DRAW_MODE.changeMode("draw_rectangle");
              SET_IS_DRAW_MODE((prev) => !prev);
            }
          }}
        >
          Draw search area on map
        </Button>
      ) : (
        <Button
          icon={<DeleteFilled />}
          onClick={() => {
            if (MAP && DRAW_MODE) {
              DRAW_MODE.deleteAll();
              SET_IS_DRAW_MODE((prev) => !prev);
              history.push({
                search: changeParams(
                  [
                    {
                      key: "geo",
                      value: null,
                      ACTION: "delete",
                    },
                  ],
                  search
                ),
              });
              SET_SEARCH_SELECTION(null);
              DRAW_MODE.changeMode("simple_select");
            }
          }}
        >
          Clear search area
        </Button>
      )}
    </b>
  );
}
