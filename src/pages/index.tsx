import { useEffect } from 'react';
import { navigate } from "gatsby"

export default () => {
  useEffect(() => {
    navigate('/ga4/');
  }, []);
  return null;
};