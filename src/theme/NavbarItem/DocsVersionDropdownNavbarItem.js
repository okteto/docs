/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import {
  useVersions,
  useLatestVersion,
  useActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';
import { useDocsPreferredVersion } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';

const getVersionMainDoc = (version) => version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}) {
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);
  const { preferredVersion, savePreferredVersionName } = useDocsPreferredVersion(docsPluginId);

  const MAX_VERSIONS = 8;
  const versionRegex =
    /^(0|[1-9]\d*\.)?(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;

  const compareVersions = (versionA, versionB) => {
    const a = versionA?.label ?? '';
    const b = versionB?.label ?? '';
    const matchA = [...a.matchAll(versionRegex)][0];
    const matchB = [...b.matchAll(versionRegex)][0];

    // Check if version format is invalid for a
    if (!matchA) return 1;
    // Check if version format is invalid for b
    if (!matchB) return -1;

    // Extract version components
    const [, aMajor = '0', aMinor, aPatch] = matchA.slice(1);
    const [, bMajor = '0', bMinor, bPatch] = matchB.slice(1);

    const aMajorInt = parseInt(aMajor);
    const aMinorInt = parseInt(aMinor);
    const aPatchInt = parseInt(aPatch);

    const bMajorInt = parseInt(bMajor);
    const bMinorInt = parseInt(bMinor);
    const bPatchInt = parseInt(bPatch);

    if (aMajorInt !== bMajorInt) {
      return bMajorInt - aMajorInt;
    }
    if (aMinorInt !== bMinorInt) {
      return bMinorInt - aMinorInt;
    }
    if (aPatchInt !== bPatchInt) {
      return bPatchInt - aPatchInt;
    }
    return 0;
  };

  function getItems() {
    const versionLinks = versions.sort(compareVersions).slice(0, MAX_VERSIONS).map((version) => {
      // We try to link to the same doc, in another version
      // When not possible, fallback to the "main doc" of the version
      const versionDoc =
        activeDocContext?.alternateDocVersions[version.name] || getVersionMainDoc(version);

      let versionDetails = '';
      if (version.name === 'current') {
        versionDetails = '(Unreleased)';
      } else if (version.isLast) {
        versionDetails = '(Latest release)';
      }

      return {
        isNavLink: true,
        label: `${version.label} ${versionDetails}`,
        to: versionDoc.path,
        isActive: () => version === activeDocContext?.activeVersion,
        onClick: () => {
          savePreferredVersionName(version.name);
        },
      };
    });
    return [...dropdownItemsBefore, ...versionLinks, ...dropdownItemsAfter];
  }

  const items = getItems();
  const dropdownVersion = activeDocContext.activeVersion ?? preferredVersion ?? latestVersion; // Mobile dropdown is handled a bit differently

  const dropdownLabel =
    mobile && items.length > 1
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description: 'The label for the navbar versions dropdown on mobile view',
        })
      : dropdownVersion.label;

  const dropdownTo =
    mobile && items.length > 1 ? undefined : getVersionMainDoc(dropdownVersion).path; // We don't want to render a version dropdown with 0 or 1 item. If we build
  // the site with a single docs version (onlyIncludeVersions: ['1.0.0']),
  // We'd rather render a button instead of a dropdown

  if (items.length <= 1) {
    return (
      <DefaultNavbarItem
        {...props}
        mobile={mobile}
        label={dropdownLabel}
        to={dropdownTo}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    );
  }

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      items={items}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
