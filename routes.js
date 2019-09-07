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
        event: 'new_chat_members',
        action: ctx => {
            const username = ctx.update.message.new_chat_members[0].username;
            ctx.reply(`halo kaka @${username} selamat datang di grup bucin`);
        },
    },
    {
        event: 'left_chat_member',
        action: ctx => {
            const username = ctx.update.message.left_chat_member.username;
            ctx.reply(`Loh kak @${username} kok keluar ?`);
        },
    }
];

module.exports = [...commands, ...events];