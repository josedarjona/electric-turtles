import { initGame } from 'game';
import { BankPage } from 'pages/BankPage';
import { Zone1Page } from 'pages/Zone1Page';
import { useEffect, useRef } from 'react';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './HomePage.scss';

const PageModal = () => {
  const navigate = useNavigate();

  const onDismiss = () => navigate(-1);
  return (
    <div className="home-modal">
      <button type="button" onClick={onDismiss}>
        close
      </button>
      <Outlet />
    </div>
  );
};

export const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const callback = useRef(null);

  useEffect(() => {
    initGame('game');
  }, []);

  useEffect(() => {
    window.removeEventListener('onEnterZone', () => {});
    window.addEventListener('onEnterZone', (e) => {
      callback.current = e.callback;
      navigate(`/${e.zoneName}`, {
        state: {
          backgroundLocation: location,
        },
      });
    });
    return () => {
      window.removeEventListener('onEnterZone', () => {});
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      callback.current?.();
      callback.current = null;
    }
  }, [location]);

  return (
    <div className="home-container">
      <div className="home-game">
        <div className="home-modal-container">
          {location.state?.backgroundLocation && (
            <Routes>
              <Route path="/" element={<PageModal />}>
                <Route path="bank" element={<BankPage />} />
                <Route path="zone_1" element={<Zone1Page />} />
              </Route>
            </Routes>
          )}
        </div>
        <div id="game" />
      </div>
    </div>
  );
};
