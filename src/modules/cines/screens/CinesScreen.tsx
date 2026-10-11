
import { Text, View } from 'react-native';

import { commonStyles } from '../../../theme';

export default function CinesScreen() {
    return (
        <View style={commonStyles.cinesContainer}>
            <Text style={commonStyles.title}>
                
            </Text>

            <View style={commonStyles.cinesMapContainer}>
                <Text style={commonStyles.cinesComingSoon}>
                    Próximamente
                </Text>

                <Text style={commonStyles.cinesDescription}>
                    Muy pronto podrás consultar la ubicación
                    de nuestros cines.
                </Text>
            </View>
        </View>
    );
}
