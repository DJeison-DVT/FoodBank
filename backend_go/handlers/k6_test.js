import http from 'k6/http';
import { check, sleep } from 'k6';

// Configure the load testing stages
export let options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
        { duration: '30s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
        { duration: '30s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

// Prepare test payloads
const baseUrl = 'http://localhost:8080';
const userID = 'testuser'; // Example user ID for testing

const endpoints = {
    orderHistory: `${baseUrl}/orders/history?user_id=${userID}`,
    orderPickup: `${baseUrl}/orders/pickup?user_id=${userID}`,
    orderSchedule: `${baseUrl}/orders/schedule?user_id=${userID}`,
    orderVerification: `${baseUrl}/orders/verification`,
    order: `${baseUrl}/orders?user_id=${userID}`,
    donation: `${baseUrl}/donations`,
    presignedURL: `${baseUrl}/s3/presigned-url?filename=testfile.jpg`,
};

const payloads = {
    pickupOrder: JSON.stringify({ order_id: 123 }),
    scheduleOrder: JSON.stringify({ order_id: 123, pickup_date: "2023-12-01", pickup_time: "10:00" }),
    verifyOrder: JSON.stringify({ order_id: 123, rejected_donations: [] }),
    createOrder: JSON.stringify({}),
    postDonation: JSON.stringify({ id: 123, title: "Test Donation", description: "Test Description", images: [] }),
};

// Headers for POST requests
const headers = { 'Content-Type': 'application/json' };

// Test function
export default function () {
    // Test order history endpoint
    let res = http.get(endpoints.orderHistory);
    check(res, { 'orderHistory: status is 200': (r) => r.status === 200 });
    sleep(1);

    // Test order pickup endpoint (GET and POST)
    res = http.get(endpoints.orderPickup);
    check(res, { 'orderPickup (GET): status is 200': (r) => r.status === 200 });
    sleep(1);

    res = http.post(endpoints.orderPickup, payloads.pickupOrder, { headers });
    check(res, { 'orderPickup (POST): status is 200': (r) => r.status === 200 });
    sleep(1);

    // Test order schedule endpoint (GET and POST)
    res = http.get(endpoints.orderSchedule);
    check(res, { 'orderSchedule (GET): status is 200': (r) => r.status === 200 });
    sleep(1);

    res = http.post(endpoints.orderSchedule, payloads.scheduleOrder, { headers });
    check(res, { 'orderSchedule (POST): status is 200': (r) => r.status === 200 });
    sleep(1);

    // Test order verification endpoint (GET and POST)
    res = http.get(endpoints.orderVerification);
    check(res, { 'orderVerification (GET): status is 200': (r) => r.status === 200 });
    sleep(1);

    res = http.post(endpoints.orderVerification, payloads.verifyOrder, { headers });
    check(res, { 'orderVerification (POST): status is 200': (r) => r.status === 200 });
    sleep(1);

    // Test main order endpoint (GET and POST)
    res = http.get(endpoints.order);
    check(res, { 'order (GET): status is 200': (r) => r.status === 200 });
    sleep(1);

    res = http.post(endpoints.order, payloads.createOrder, { headers });
    check(res, { 'order (POST): status is 201': (r) => r.status === 201 });
    sleep(1);

    // Test donation endpoint (GET, POST, DELETE)
    res = http.post(endpoints.donation, payloads.postDonation, { headers });
    check(res, { 'donation (POST): status is 200': (r) => r.status === 200 });
    sleep(1);

    res = http.del(`${endpoints.donation}?id=123`);
    check(res, { 'donation (DELETE): status is 200': (r) => r.status === 200 });
    sleep(1);

    // Test presigned URL endpoint
    res = http.get(endpoints.presignedURL);
    check(res, { 'presignedURL: status is 200': (r) => r.status === 200 });
    sleep(1);
}
