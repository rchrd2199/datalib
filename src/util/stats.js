var util = require('./util');
var stats = {};

stats.unique = function(values, f, results) {
  if (!util.isArray(values) || values.length===0) return [];
  results = results || [];
  var u = {}, v, i;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    results.push(v);
  }
  return results;
};

stats.count = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null) count += 1;
  }
  return count;
};

stats.count.distinct = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var u = {}, v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

stats.count.nulls = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

stats.median = function(values, f) {
  if (f) values = values.map(f);
  values = values.filter(util.isNotNull).sort(util.cmp);
  var half = Math.floor(values.length/2);
  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half-1] + values[half]) / 2.0;
  }
};

stats.mean = function(values, f) {
  var mean = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null) {
      delta = values[i] - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

stats.variance = function(values, f) {
  var mean = 0, M2, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null) {
      delta = values[i] - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (len - 1);
  return M2;
};

stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

stats.skew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return 1.0 * (avg - med) / std;
};

stats.minmax = function(values, f) {
  var s = {min: +Infinity, max: -Infinity}, v, i, n;
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null) {
      if (v > s.max) s.max = v;
      if (v < s.min) s.min = v;
    }
  }
  return s;
};

stats.minIndex = function(values, f) {
  if (!util.isArray(values) || values.length==0) return -1;
  var idx = 0, v, i, n, min = +Infinity;
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null && v < min) { min = v; idx = i; }
  }
  return idx;
};

stats.maxIndex = function(values, f) {
  if (!util.isArray(values) || values.length==0) return -1;
  var idx = 0, v, i, n, max = -Infinity;
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null && v > max) { max = v; idx = i; }
  }
  return idx;
};

stats.bin = require('./bin');

module.exports = stats;