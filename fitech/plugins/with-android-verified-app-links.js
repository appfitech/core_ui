const { createRunOncePlugin, withAndroidManifest } = require('@expo/config-plugins');

/**
 * Fixes Android App Link verification when expo-dev-client / other plugins inject
 * `exp+` or custom schemes into `autoVerify` intent filters (links open in Chrome).
 *
 * @see https://github.com/expo/expo/issues/19745
 * @see docs/ANDROID_APP_LINKS.md
 */

function activityHasSingleTaskLaunchMode(activity) {
  return activity?.$?.['android:launchMode'] === 'singleTask';
}

function intentFilterHasAutoVerification(intentFilter) {
  return intentFilter?.$?.['android:autoVerify'] === 'true';
}

function cleanAutoVerifiedIntentFilter(intentFilter) {
  if (!intentFilter?.data || !Array.isArray(intentFilter.data)) {
    return;
  }

  intentFilter.data = intentFilter.data.filter((entry) => {
    const scheme = entry?.$?.['android:scheme'] ?? '';
    return scheme === 'http' || scheme === 'https';
  });
}

function cleanNonVerifiedIntentFilters(intentFilter) {
  if (!intentFilter?.data || !Array.isArray(intentFilter.data)) {
    return;
  }

  intentFilter.data = intentFilter.data.filter((entry) => {
    const scheme = entry?.$?.['android:scheme'] ?? '';
    return scheme !== 'http' && scheme !== 'https';
  });
}

function withAndroidVerifiedAppLinks(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    for (const application of manifest.manifest.application ?? []) {
      for (const activity of application.activity ?? []) {
        if (!activityHasSingleTaskLaunchMode(activity)) {
          continue;
        }

        for (const intentFilter of activity['intent-filter'] ?? []) {
          if (intentFilterHasAutoVerification(intentFilter)) {
            cleanAutoVerifiedIntentFilter(intentFilter);
          } else {
            cleanNonVerifiedIntentFilters(intentFilter);
          }
        }
        break;
      }
    }

    return config;
  });
}

module.exports = createRunOncePlugin(
  withAndroidVerifiedAppLinks,
  'with-android-verified-app-links',
  '1.0.0',
);
