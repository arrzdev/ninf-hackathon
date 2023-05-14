import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/atividades');
  }, [router]);

  return <></>;
};

export default Logout;
