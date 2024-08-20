import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';

function Index() {
  const [BackendData, setBackendData] = useState<any[]>([]);
  const [Width, setWidth] = useState(0);
  const navigate = useNavigate();
  const server_path = localStorage.getItem('server_path');

  const sendDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = Number(event.currentTarget.id);

    try {
      const response = await fetch(server_path + '/api/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: buttonId }),
      });

      const data = await response.json();
      console.log(data);

      // Update state without reloading the page
      setBackendData(prevData => prevData.filter(item => item.id !== buttonId));
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const sendData = async (): Promise<any[]> => {
    try {
      const response = await fetch(server_path + '/api/images', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 403) {
        Cookies.remove("token");
        navigate('/login');
        return [];
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await sendData();
      setBackendData(data);
    };

    fetchData();
  }, []); // Remove navigate from dependency array

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  var type: string;

  if (Width < 600) {
    type = "100";
  } else if (Width > 600 && Width < 1000) {
    type = "200";
  } else {
    type = "400";
  }

  return (
    <>
      <div className="gallery">
        {BackendData.map((item, index) => (
          <div className="gallery-item">
            <a href={`${server_path}/api/image/${item.id}/download`}>
              <img src={`${server_path}/api/image/${item.id}/${type}`} alt={item.alt} />
            </a>

            <figcaption className="figure-caption">{item.subject}</figcaption>
            <button className="btn btn-primary" onClick={sendDelete} id={String(item.id)}>delete</button>
          </div>  
        ))}
      </div>

      <div className="mb-3">
        <a href="/upload">Upload</a>
      </div>

      <div className="mb-3">
        <a href="/logout">Logout</a>
      </div>
    </>
  );
}

export default Index;
