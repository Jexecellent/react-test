import Platform from './platform';

export function isSupported() {
  const ua = navigator.userAgent;
  //华为mate7 默认浏览器
  if (Platform.uaContains('HUAWEI_MT7-TL10_TD')) {
    return false;
  }
  //华为mate8, 华为畅享5s, 华为p9 plus, 默认浏览器
  if (/Mozilla\/[\.0-9]* \(Linux; Android [\.0-9]*;.*? (HUAWEI TAG-AL00|HUAWEI NXT-AL10|VIE-AL10) Build\/(TAG-AL00|HUAWEINXT-AL10|HUAWEIVIE-AL10)\) AppleWebKit\/[\.0-9]* \(KHTML, like Gecko\) Version\/[\.0-9]* (Chrome\/[\.0-9]* )?Mobile Safari\/[\.0-9]*$/.test(ua)) {
    return false;
  }
  //oppo x9 百度浏览器 搜狗浏览器
  if (Platform.uaContains('vivo X9') && (Platform.uaContains('baidubrowser') || Platform.uaContains('SogouMobileBrowser'))) {
    return false;
  }
  return true;
}