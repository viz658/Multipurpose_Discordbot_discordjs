const pb = {
    le: '<:_le:1125454286004949053>',
    me: '<:_me:1125454225481150566>',
    re: '<:_re:1125454274739052714>',
    lf: '<:_lf:1125454312638795866>',
    mf: '<:_mf:1125454236189196349>',
    rf: '<:_rf:1125454256116334682>',
  };
  
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
  
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
  
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
  
    const progressBar =
      (filledSquares ? pb.lf : pb.le) +
      (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? pb.rf : pb.re);
  
    const results = [];
    results.push(
      `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
        downvotes.length
      } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
  
    return results.join('\n');
  }
  
  module.exports = formatResults;
  