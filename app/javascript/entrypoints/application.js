import { createConsumer } from "@anycable/web";
import { start } from "@anycable/turbo-stream";

// Inisialisasi consumer ke server AnyCable-Go (port 8080)
const consumer = createConsumer("wss://rubyminimarket.test:8080/cable");
// Gunakan 'start' sebagai pengganti 'subscribeToTurboStreams'
// Ini akan secara otomatis menangani elemen <turbo-cable-stream-source>
start(consumer);

console.log("Vite ⚡️ Rails with AnyCable");

// Optional: Simpan di window untuk debugging
window.App = { cable: consumer };