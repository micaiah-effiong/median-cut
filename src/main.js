// get pixel data
// find color channel with largest range
// sort by channel with largest range
// divide at median
// repeat until max bucket

function init(canvas, img) {
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  window.ctx = ctx; // to be removed
  ctx.drawImage(img, 0, 0);
  const canvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const colorChannel = createColorChannels(canvasImage.data);
  console.log(canvasImage);
  const palette = quntization(colorChannel);
  console.log(palette);
  return palette;
}

function quntization(colors, maxBuckets = 4) {
  // maxBuckets = Math.sqrt(maxBuckets);
  if (maxBuckets <= 0) {
    // get bucket avrage
    return bucketAvrage(colors);
  }

  // range
  const colorChannelRange = getColorChannelRange(colors);
  const largestChannel = getLargestChannel(colorChannelRange);

  // sort
  const sortedColors = sortChannel(colors, largestChannel);

  // divided
  const bucketPair = divideBucket(sortedColors);

  // console.log(ctx, colors, colorChannelRange, largestChannel, sortedColors);
  // [q(), q()].flat()
  return bucketPair.map((elt) => quntization(elt, maxBuckets - 1)).flat();
}

function createColorChannels(colorArray) {
  const colorChannels = [];
  for (let i = 0; i < colorArray.length; i = i + 4) {
    colorChannels.push({
      r: colorArray[i],
      g: colorArray[i + 1],
      b: colorArray[i + 2],
    });
  }
  return colorChannels;
}

function getLargestChannel(colorChannelRange) {
  const { r, g, b } = colorChannelRange;
  const val = Math.max(r, g, b);

  return ["r", "g", "b"].find((channel) => {
    return colorChannelRange[channel] === val;
  });
}

function getColorChannelRange(colorChannelData) {
  return {
    r: range(colorChannelData, "r"),
    g: range(colorChannelData, "g"),
    b: range(colorChannelData, "b"),
  };
}

function range(array, channel) {
  const min = findMin(array, channel);
  const max = findMax(array, channel);
  const diff = max - min;
  // console.log(max, min, diff);
  return diff;
}

function findMax(array, channel) {
  let figure = 0;
  array.forEach((num) => {
    if (num[channel] > figure) {
      figure = num[channel];
    }
  });
  return figure;
}
function findMin(array, channel) {
  let figure = 0;
  array.forEach((num) => {
    if (num[channel] < figure) {
      figure = num[channel];
    }
  });
  return figure;
}

function sortChannel(colors, channel) {
  return colors.sort((a, b) => a[channel] - b[channel]);
}

function divideBucket(bucket, times = 2) {
  const cutPoints = Math.floor(bucket.length / times);
  const start = bucket.slice(0, cutPoints);
  const end = bucket.slice(cutPoints);
  return [start, end];

  // const groups = [];
  // for (let i = 0; i < times; i++) {
  //   let range = Math.floor(bucket.length / times) * i;
  //   let part;

  //   if (i + 1 === times) {
  //     part = bucket.slice(range, range + bucket.length);
  //   } else {
  //     part = bucket.slice(range, range + times);
  //   }

  //   groups.push(part);
  // }

  // return groups;
}

function bucketAvrage(bucket) {
  const size = bucket.length;
  const val = bucket.reduce((a, b) => {
    return {
      r: a.r + b.r,
      g: a.g + b.g,
      b: a.b + b.b,
    };
  });

  val.r = Math.floor(val.r / size);
  val.g = Math.floor(val.g / size);
  val.b = Math.floor(val.b / size);

  return val;
}

const imgs = new Image();
imgs.src = "img2.jpg";
imgs.onload = () => {
  const palette = init(document.querySelector("canvas"), imgs);
  createWheel(palette);
};

function createWheel(palette) {
  const preview = document.querySelector("#preview");
  Array.from(preview.children).forEach((e) => e.remove());
  palette.forEach((color) => {
    const elt = document.createElement("div");
    elt.style.width = "20px";
    elt.style.height = "20px";
    elt.style.backgroundColor = `rgb(${color.r} ${color.g} ${color.b})`;
    preview.appendChild(elt);
  });
}
