let SOC = require("socket.io");
// let Team = require('../components/team');
let io;

start = function (server) {
  io = SOC(server);
  let val = "";

  io.on("connection", function (socketClient) {
    console.log("####-#### some one connected ####-#### ", socketClient.id);
     socketClient.on('joinRequest', (pm) => {
        socketClient.join(pm.sender);
    });

    socketClient.on('mailRequest', (mail) => {
        console.log('Rooms: ', io.sockets.adapter.rooms);
        io.to(mail.receiver).emit('newMailRequest', {
            from: mail.sender,
            to: mail.receiver
        });
    })


     // Log whenever a client disconnects from our websocket server
     socketClient.on("disconnect", function() {
        console.log("user disconnected");
    });
  });
};

// sendScore = function (score, room) {
//     console.log("send score:", score);
//     io.emit('updatescore', { id: room, score: score });
//     io.sockets.in(room).emit('scoreUpdate', score || "no score");
// }

module.exports = {
  socketStart: start,
  // updateScore: sendScore
};
