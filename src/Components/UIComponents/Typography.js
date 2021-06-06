import React from 'react';
import styled from 'styled-components';
import { deviceSize } from '../../responsive/responsive';

const Pagetitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: black;

  padding: ${({ padding }) => (padding ? padding : '10px 20px')};
`;

const H3title = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 20px;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 500)};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};

  padding: ${({ padding }) => (padding ? padding : '10px 0px')};
`;

const Subtitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};
  margin: ${({ margin }) => (margin ? margin : '12px 0 0 0')};
  padding: ${({ padding }) => (padding ? padding : '0 20px')};
`;

const Itemtitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};
  margin: 0;
  padding: ${({ padding }) => (padding ? padding : '0')};

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 14px;
  }
`;

const SubItemtitle = styled.div`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};
  margin: 0;
  padding: ${({ padding }) => (padding ? padding : '0')};

  @media screen and (max-width: ${deviceSize.mobileS}px) {
    font-size: 14px;
  }
`;

const DescriptionContent = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#5d6267')};
  padding: ${({ padding }) => (padding ? padding : '0')};
  margin: 0px;
`;

const Contentbody = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 400)};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};
  margin: 0;
  padding: ${({ padding }) => (padding ? padding : '0')};
`;

const LinkTag = styled.a`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px;

  text-align: center;
  text-decoration: none;
  color: ${({ color }) => (color ? '#' + color : '#185EE6')};
  padding: ${({ padding }) => (padding ? padding : '0')};

  margin: 0px;
  flex-grow: 1;
`;

function PageTitle(props) {
  const { padding } = props;
  return (
    <Pagetitle style={props.style} padding={padding}>
      {props.children}
    </Pagetitle>
  );
}

function H3Title(props) {
  const { padding, color, fontWeight } = props;
  return (
    <H3title style={props.style} padding={padding} color={color} fontWeight={fontWeight}>
      {props.children}
    </H3title>
  );
}

function Description(props) {
  const { color, padding } = props;
  return (
    <DescriptionContent color={color} padding={padding}>
      {props.children}
    </DescriptionContent>
  );
}

function SubTitle(props) {
  const { padding, color, id, margin } = props;
  return (
    <Subtitle color={color} padding={padding} id={id} margin={margin} style={props.style}>
      {props.children}
    </Subtitle>
  );
}

function ItemTitle(props) {
  const { padding, color, id } = props;
  return (
    <Itemtitle color={color} padding={padding} id={id}>
      {props.children}
    </Itemtitle>
  );
}

function SubItemTitle(props) {
  const { padding, color, id } = props;
  return (
    <SubItemtitle color={color} padding={padding} id={id} style={props.style} onClick={props.onClick}>
      {props.children}
    </SubItemtitle>
  );
}
function Content(props) {
  const { padding, fontWeight, color } = props;
  return (
    <Contentbody padding={padding} fontWeight={fontWeight} color={color} style={props.style}>
      {props.children}
    </Contentbody>
  );
}

function Link(props) {
  const { padding, color, name } = props;
  return (
    <LinkTag padding={padding} color={color} name={name}>
      {props.children}
    </LinkTag>
  );
}
export { PageTitle, Description, SubTitle, ItemTitle, Content, SubItemTitle, Link, H3Title };
