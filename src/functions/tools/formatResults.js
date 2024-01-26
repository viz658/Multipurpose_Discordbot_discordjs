function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
  
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
  
    const results = [];
    results.push(
      `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
        downvotes.length
      } downvotes (${downPercentage.toFixed(1)}%)`
    );
  
    return results.join('\n');
  }
  
  module.exports = formatResults;
  