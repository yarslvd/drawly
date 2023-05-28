async function checkIsParticipant(participants, user_id, canvas_id) {
  let participant = await participants.findOne({
    where: {
      user_id: user_id,
      canvas_id: canvas_id,
    },
  });

  return !!participant;
}

module.exports = {
  checkIsParticipant,
};
