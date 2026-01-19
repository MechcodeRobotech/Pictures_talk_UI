import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';

const ICON_GAP_PX = 8;
const DELETE_ICON_RAW_SVG = renderToStaticMarkup(
  <DeleteIcon style={{ fill: '#e53e3e' }} />,
);
const DELETE_ICON_WITH_NAMESPACE = DELETE_ICON_RAW_SVG.includes('xmlns=')
  ? DELETE_ICON_RAW_SVG
  : DELETE_ICON_RAW_SVG.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
const DELETE_ICON_WITH_COLOR = DELETE_ICON_WITH_NAMESPACE.includes('fill=')
  ? DELETE_ICON_WITH_NAMESPACE
  : DELETE_ICON_WITH_NAMESPACE.replace('<svg ', '<svg fill="#e53e3e" ');
export const DELETE_ICON_SVG = DELETE_ICON_WITH_COLOR.replace(
  /<svg\b([^>]*)>/,
  '<svg$1><rect x="1" y="1" width="22" height="22" rx="6" fill="#ffffff" stroke="#e53e3e" stroke-width="1.5" />',
);

interface AddProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
}

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${ICON_GAP_PX}px;
`;

const Add: React.FC<AddProps> = ({ label, onClick, className, icon = 'add' }) => (
  <AddButton type="button" onClick={onClick} className={className}>
    <span className="material-symbols-outlined" aria-hidden="true">
      {icon}
    </span>
    <span>{label}</span>
  </AddButton>
);

export default Add;
