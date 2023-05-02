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
          <h1>Upcoming changes to data.tnris.org</h1>
          <hr />
          <p>
            <strong>Starting Monday, May 15th</strong>, you may notice some
            aesthetic changes to the TNRIS data hub. These changes serve a dual
            purpose of improving site accessibility and providing an interface
            to make payments online. The changes, aside from the data payment
            portal, are solely aesthetic and you are able to continue using
            the data hub as usual. If you experience any issues, please report
            them using the general contact form found in the footer of this
            webpage.
          </p>
          <p>
            Thank you for your continued support as we continue efforts to
            modernize and improve our data delivery services. We are dedicated
            to continually improving our public data services, and we hope that
            these changes make getting the data you need easier and faster.
          </p>
          <p>Best Regards,</p>
          <h4>TNRIS</h4>
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
  overflow: "scroll",
};

const modalButtonsBarStyle = {
  display: "grid",
  gridTemplateColumns: "auto",
  justifyContent: "end",
  alignContent: "end",
  gap: "2rem",
};
