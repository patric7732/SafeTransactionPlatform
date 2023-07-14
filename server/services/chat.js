const { Container } = require("typedi");

class ChatService {
  constructor() {
    this.User = Container.get("userModel");
    this.ChatLog = Container.get("chatLogModel");
    this.ChatRoom = Container.get("chatRoomModel");
    this.socketService = Container.get("socketService");
  }

  async createRoom(roomData) {
    const io = this.socketService.getIo();
    const room = await this.ChatRoom.create(roomData);
    return room;
  }

  async getRoomById(id) {
    const room = await this.ChatRoom.findByPk(id);
    const roomData = room.toJSON();
    return roomData;
  }

  async getAllRoomByUser(id) {
    const user = await this.User.findByPk(id);
    // const room = await this.ChatRoom.findByPk(id);
    const [sellingRooms, buyingRooms] = await Promise.allSettled([
      user.getSellingRooms(),
      user.getBuyingRooms(),
    ]);

    const allRooms = sellingRooms.concat(buyingRooms);
    console.log(allRooms);
    // const room = await this.ChatRoom.findAll();
    // const roomData = room.toJSON();
    return allRooms;
  }

  async deleteRoom(id) {
    const io = this.socketService.getIo();
  }

  async sendMessage() {
    const io = this.socketService.getIo();
  }

  async getMessageByRoom() {
    const io = this.socketService.getIo();
  }
}

module.exports = ChatService;
