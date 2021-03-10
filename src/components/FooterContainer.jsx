import { Col, Dropdown, Menu, Popover, Row, Space } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React from "react";

const footerLinks = {
  Legal: {
    "Privacy/Security Policy":
      "https://tnris.org/site-policies#privacy-and-security-policy",
    Accessibility: "https://tnris.org/site-policies#accessibility-policy",
    "Open Records Request": "http://www.twdb.texas.gov/home/open_records.asp",
    "Compact with Texans": "http://www.twdb.texas.gov/home/compact_texan.asp",
    "Fraud & Waste": "http://www.twdb.texas.gov/home/fraud.asp",
    TRAIL: "https://www.tsl.texas.gov/trail/index.html",
    "Texas.gov": "http://www.texas.gov/",
    "Texas Water Development Board": "http://www.twdb.texas.gov/",
  },
  Copyright:
    "Content of this site © Texas Natural Resources Information System and Texas Water Development Board unless otherwise noted.",
  Programs: {
    "Applications & Utilities": "https://tnris.org/applications-and-utilities/",
    "Texas GIO": "https://tnris.org/geographic-information-office/",
    "Research & Distribution": "https://tnris.org/research-distribution-center",
    "StratMap Program": "https://tnris.org/stratmap/",
    "Education & Training": "https://tnris.org/education/",
    Events: "https://tnris.org/events/",
    "About Us": "https://tnris.org/about/",
  },
};

export function FooterContainer(props) {
  return (
    <Footer style={{ padding: "0px 8vw" }} className="footer">
      <Row justify="center">
        <Col xs={{ span: 24 }} md={{ span: 16 }}>
          <Row justify="space-between">
            {Object.keys(footerLinks).map((v, i) => (
              <Dropdown
                key={`menu_${i}__${v}`}
                overlay={
                  <>
                    {typeof footerLinks[v] === "string" && (
                        <div style={{ background: "#222", color: "white", maxWidth: "200px", padding: "1rem", borderRadius: ".25rem"}}>{footerLinks[v]}</div>
                    )}
                    {typeof footerLinks[v] === "object" && (
                      <Menu key={`menu_${i}__${v}`} title={v} theme="dark">
                        {Object.keys(footerLinks[v]).map((linkKey, j) => (
                          <Menu.Item key={`menu_${i}__${v}_item_${j}`}>
                            <a href={footerLinks[v][linkKey]}>{linkKey}</a>
                          </Menu.Item>
                        ))}
                      </Menu>
                    )}
                  </>
                }
              >
                <div className="footerLink">{v}</div>
              </Dropdown>
            ))}
          </Row>
        </Col>
      </Row>
    </Footer>
  );
}
