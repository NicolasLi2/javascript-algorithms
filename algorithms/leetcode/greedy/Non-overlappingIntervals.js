// 435. Non-overlapping Intervals
// https://leetcode.com/problems/non-overlapping-intervals/description/

/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function (intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = intervals[0][1];
  let overlaps = 0;

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) overlaps++;
    else end = intervals[i][1];
  }

  return overlaps;
};
