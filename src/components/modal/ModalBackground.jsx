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
            changes to data.tnris.org. These changes serve a dual
            purpose of improving site accessibility and providing an interface
            to make payments online for custom data orders.
            Custom data orders are submitted in the exact same way they have been.
            However, you will receive an email upon submission with a link to check your order status.
            Once our team has processed your order and the cost of your order has been calculated, you will receive
            another email with a link to the data.tnris.org payment portal. Follow on-screen guidance to submit your electronic payment.
          </p>
          <p>
            We thank you for your continued support as we proceed with our efforts to
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
  overflow: "auto",
};

const modalButtonsBarStyle = {
  display: "grid",
  gridTemplateColumns: "auto",
  justifyContent: "end",
  alignContent: "end",
  gap: "2rem",
};
