const commands = [
    {
        command: "help"
    },
    {
        command: "status"
    }
];

const events = [
    {
        event: 'new_chat_members'
    }
];

module.exports = [...commands, ...events];