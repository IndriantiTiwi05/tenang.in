//* Test awal gabungan 5 VU dn 10 VU
// import http from "k6/http";
// import { check, sleep } from "k6";

// const BASE_URL = "http://localhost:3000";

// export const options = {
//   stages: [
//     { duration: "30s", target: 5 },
//     { duration: "1m", target: 10 },
//     { duration: "30s", target: 0 },
//   ],
//   thresholds: {
//     http_req_failed: ["rate<0.05"],
//     http_req_duration: ["p(95)<2000"],
//   },
// };

// export function setup() {
//   const login = http.post(
//     `${BASE_URL}/api/auth/login`,
//     JSON.stringify({
//       email: __ENV.TEST_EMAIL,
//       password: __ENV.TEST_PASSWORD,
//     }),
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   check(login, {
//     "login berhasil": (r) => r.status === 200,
//   });

//   const token = login.cookies.authToken?.[0]?.value;

//   if (!token) {
//     throw new Error("Login gagal atau cookie authToken tidak ditemukan");
//   }

//   return { token };
// }

// export default function (data) {
//   const response = http.get(
//     `${BASE_URL}/api/checkin/chart`,
//     {
//       headers: {
//         Cookie: `authToken=${data.token}`,
//       },
//     }
//   );

//   check(response, {
//     "chart berhasil diakses": (r) => r.status === 200,
//   });

//   sleep(1);
// }



//*5 VU
// import http from "k6/http";
// import { check, sleep } from "k6";

// const BASE_URL = "http://localhost:3000";

// export const options = {
//   stages: [
//     { duration: "30s", target: 5 },
//     { duration: "1m", target: 5 },
//     { duration: "30s", target: 0 },
//   ],
//   thresholds: {
//     http_req_failed: ["rate<0.05"],
//     http_req_duration: ["p(95)<2000"],
//   },
// };

// export function setup() {
//   const login = http.post(
//     `${BASE_URL}/api/auth/login`,
//     JSON.stringify({
//       email: __ENV.TEST_EMAIL,
//       password: __ENV.TEST_PASSWORD,
//     }),
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   check(login, {
//     "login berhasil": (r) => r.status === 200,
//   });

//   const token = login.cookies.authToken?.[0]?.value;

//   if (!token) {
//     throw new Error("Login gagal atau cookie authToken tidak ditemukan");
//   }

//   return { token };
// }

// export default function (data) {
//   const response = http.get(
//     `${BASE_URL}/api/checkin/chart`,
//     {
//       headers: {
//         Cookie: `authToken=${data.token}`,
//       },
//     }
//   );

//   check(response, {
//     "chart berhasil diakses": (r) => r.status === 200,
//   });

//   sleep(1);
// }


//* 10 VU
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:3000";

// skenario pengujian
export const options = {
    stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 10 },
        { duration: "30s", target: 0 },
    ],
    thresholds: {
        http_req_failed: ["rate<0.05"],
        http_req_duration: ["p(95)<2000"],
    },
};

// autentikasi
export function setup() {
  const login = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.TEST_EMAIL,
      password: __ENV.TEST_PASSWORD,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(login, {
    "login berhasil": (r) => r.status === 200,
  });

  const token = login.cookies.authToken?.[0]?.value;

  if (!token) {
    throw new Error("Login gagal atau cookie authToken tidak ditemukan");
  }

  return { token };
}

// Mengirimkan permintaan ke API
export default function (data) {
  const response = http.get(
    `${BASE_URL}/api/checkin/chart`,
    {
      headers: {
        Cookie: `authToken=${data.token}`,
      },
    }
  );

  check(response, {
    "chart berhasil diakses": (r) => r.status === 200,
  });

  sleep(1);
}


// 20 VU
// import http from "k6/http";
// import { check, sleep } from "k6";

// const BASE_URL = "http://localhost:3000";

// export const options = {
//   stages: [
//     { duration: "30s", target: 20 },
//     { duration: "1m", target: 20 },
//     { duration: "30s", target: 0 },
//   ],
//   thresholds: {
//     http_req_failed: ["rate<0.05"],
//     http_req_duration: ["p(95)<2000"],
//   },
// };

// export function setup() {
//   const login = http.post(
//     `${BASE_URL}/api/auth/login`,
//     JSON.stringify({
//       email: __ENV.TEST_EMAIL,
//       password: __ENV.TEST_PASSWORD,
//     }),
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   check(login, {
//     "login berhasil": (r) => r.status === 200,
//   });

//   const token = login.cookies.authToken?.[0]?.value;

//   if (!token) {
//     throw new Error("Login gagal atau cookie authToken tidak ditemukan");
//   }

//   return { token };
// }

// export default function (data) {
//   const response = http.get(
//     `${BASE_URL}/api/checkin/chart`,
//     {
//       headers: {
//         Cookie: `authToken=${data.token}`,
//       },
//     }
//   );

//   check(response, {
//     "chart berhasil diakses": (r) => r.status === 200,
//   });

//   sleep(1);
// }
