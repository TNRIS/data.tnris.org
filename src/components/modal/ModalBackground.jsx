import { Button, Checkbox } from "antd";
import { useState } from "react";

const getShowFromLocalStorage = () => {
  const SHOW = localStorage.getItem("MODAL_SHOW");
  if (SHOW == "false") {
    return false;
  }
  return true;
};

const toggleShowFromLocalStorage = () => {
  return localStorage.setItem("MODAL_SHOW", "false");
};

export function ModalBackground({ children }) {
  let [showModal, setShowModal] = useState(getShowFromLocalStorage);
  let [doNotShow, setDoNotShow] = useState(false);

  const toggleDoNotShow = () => {
    setDoNotShow(!doNotShow);
  };
  const toggleModal = () => {
    if (doNotShow) {
      toggleShowFromLocalStorage();
    }
    setShowModal(!showModal);
  };

  if (showModal) {
    return (
      <section style={modalWrapperStyle}>
        <div style={modalContainerStyle}>
          <h1>New Updates Are Coming...</h1>
          <hr />
          <p>
            We're working on necessary maintenance changes for data.tnris.org and a new feature for making payments online for custom data orders. We appreciate your patience as we roll these out in the coming days.
          </p>
          <p>
            Thank you for your support as we modernize and improve our data delivery services to better serve you.
          </p>
          <p>Best Regards,</p>
          <h4>TNRIS Team</h4>
          <hr />
          <div style={modalButtonsBarStyle}>
            <Checkbox value={doNotShow} onClick={toggleDoNotShow}>
              do not show this message again
            </Checkbox>
            <Button type="primary" onClick={toggleModal}>
              Okay
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

const modalWrapperStyle = {
  display: "grid",
  position: "absolute",
  width: "100vw",
  height: "100vh",
  padding: "1rem",
  gridTemplateColumns: "1fr",
  alignContent: "center",
  justifyContent: "center",
  background: "rgba(49, 42, 42, 0.67)",
  zIndex: "999999",
};

const modalContainerStyle = {
  maxWidth: "1200px",
  maxHeight: "100%",
  background: "white",
  margin: "auto",
  padding: "1rem",
  borderRadius: ".5rem",
  overflow: "auto",
};

const modalButtonsBarStyle = {
  display: "grid",
  gridTemplateColumns: "auto",
  justifyContent: "end",
  alignContent: "end",
  gap: "2rem",
};
