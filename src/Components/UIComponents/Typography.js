import React from 'react';
import styled from 'styled-components';

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
  margin: 12px 0 0 0;
  padding: ${({ padding }) => (padding ? padding : '0 20px')};
`;

const Itemtitle = styled.div`
  width: 210px;
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
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.5px
  text-align: left;
  color: ${({ color }) => (color ? '#' + color : '#000000')};
  margin: 0;
  padding: ${({ padding }) => (padding ? padding : '0')};
`;

function PageTitle(props) {
  const { padding } = props;
  return (
    <Pagetitle style={props.style} padding={padding}>
      {props.children}
    </Pagetitle>
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
  const { padding, color, id } = props;
  return (
    <Subtitle color={color} padding={padding} id={id}>
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
function Content(props) {
  const { padding } = props;
  return <Contentbody padding={padding}>{props.children}</Contentbody>;
}
export { PageTitle, Description, SubTitle, ItemTitle, Content };
