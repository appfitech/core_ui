import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  getDepartments,
  getDistricts,
  getProvinces,
  getUbigeoData,
} from 'ubigeo-fns';

import { AppText } from '@/components/AppText';
import { Dropdown } from '@/components/Dropdown';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Option = {
  label: string;
  value: string;
};

type Props = {
  id: string;
  value?: number | null;
  onChange: (locationId: number | undefined) => void;
};

function codesFromUbigeo(ubigeo: string) {
  return {
    departmentCode: ubigeo.slice(0, 2),
    provinceCode: ubigeo.slice(0, 4),
    districtCode: ubigeo,
  };
}

export function ResidencePicker({ id, value, onChange }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState<string | null>(null);
  const [districtCode, setDistrictCode] = useState<string | null>(null);

  useEffect(() => {
    if (value == null) return;

    const ubigeo = String(value).padStart(6, '0');
    const codes = codesFromUbigeo(ubigeo);

    try {
      getUbigeoData(ubigeo);
      setDepartmentCode(codes.departmentCode);
      setProvinceCode(codes.provinceCode);
      setDistrictCode(codes.districtCode);
    } catch {
      // ignore invalid stored value
    }
  }, [value]);

  const departmentOptions: Option[] = useMemo(
    () =>
      getDepartments().map((department) => ({
        label: department.name,
        value: department.code,
      })),
    [],
  );

  const provinceOptions: Option[] = useMemo(() => {
    if (!departmentCode) return [];

    return getProvinces(departmentCode).map((province) => ({
      label: province.name,
      value: province.code,
    }));
  }, [departmentCode]);

  const districtOptions: Option[] = useMemo(() => {
    if (!provinceCode) return [];

    return getDistricts(provinceCode).map((district) => ({
      label: district.name,
      value: district.code,
    }));
  }, [provinceCode]);

  const selectedResidence = districtCode ? getUbigeoData(districtCode) : null;

  const clearSelection = () => onChange(undefined);

  return (
    <View key={id} style={styles.container}>
      <Dropdown
        label="Departamento"
        id={`${id}-department`}
        options={departmentOptions}
        value={departmentCode}
        placeholder="Selecciona departamento"
        search
        searchPlaceholder="Buscar departamento..."
        zIndex={3000}
        onChange={(code) => {
          setDepartmentCode(code);
          setProvinceCode(null);
          setDistrictCode(null);
          clearSelection();
        }}
      />

      <Dropdown
        label="Provincia"
        id={`${id}-province`}
        options={provinceOptions}
        value={provinceCode}
        placeholder="Selecciona provincia"
        search
        searchPlaceholder="Buscar provincia..."
        zIndex={2000}
        disabled={!departmentCode}
        onChange={(code) => {
          setProvinceCode(code);
          setDistrictCode(null);
          clearSelection();
        }}
      />

      <Dropdown
        label="Distrito"
        id={`${id}-district`}
        options={districtOptions}
        value={districtCode}
        placeholder="Selecciona distrito"
        search
        searchPlaceholder="Buscar distrito..."
        zIndex={1000}
        disabled={!provinceCode}
        onChange={(code) => {
          setDistrictCode(code);
          onChange(Number(code));
        }}
      />

      {selectedResidence ? (
        <AppText variant="caption" style={styles.selectedText}>
          {selectedResidence.district}, {selectedResidence.province},{' '}
          {selectedResidence.department}
        </AppText>
      ) : null}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    selectedText: {
      marginTop: 4,
      color: theme.text.secondary,
    },
  });
