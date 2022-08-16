import * as tf from '@tensorflow/tfjs';
import {decodeJpeg} from './decode_image';
import {bundleResourceIO} from './bundle_resource_io';

import {Base64Binary} from './utils';
const BITMAP_DIMENSION = 224;

const modelJson = require('./model/model.json');
const modelWeights = require('./model/weights.bin');

const URL = "https://teachablemachine.withgoogle.com/models/6UDNfJGGG/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

// 0: channel from JPEG-encoded image
// 1: gray scale
// 3: RGB image
const TENSORFLOW_CHANNEL = 3;

export const getModel = async () => {
  try {
    // wait until tensorflow is ready
    await tf.ready();
    // load the trained model
    return await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    
    // Load from URL only works after manually applying this patch
    // https://github.com/facebook/react-native/pull/30769/commits/497846df05b81536e5f6b87f17239e8ceb1bc9df
    // location: node_modules/react-native/Libraries/Blob/FileReader.js
    // return await tf.loadLayersModel(tf.io.http(modelURL, {fetchFunc: fetch,}));
  } catch (error) {
    console.log('Couldd not load model', error);
  }
};
 
export const convertBase64ToTensor = async (base64) => {
  try {
    const uIntArray = Base64Binary.decode(base64);
    // decode a JPEG-encoded image to a 3D Tensor of dtype
    const decodedImage = decodeJpeg(uIntArray, 3);
    // reshape Tensor into a 4D array
    return decodedImage.reshape([
      1,
      BITMAP_DIMENSION,
      BITMAP_DIMENSION,
      TENSORFLOW_CHANNEL,
    ]);
  } catch (error) {
    console.log('Could not convert base64 string to tesor', error);
  }
};

export const startPrediction = async (model, tensor) => {
  try {
    // predict against the model
    const output = await model.predict(tensor);
    // return typed array
    return output.dataSync();
  } catch (error) {
    console.log('Error predicting from tesor image', error);
  }
};