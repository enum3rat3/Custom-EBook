<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                exclude-result-prefixes="fo">

    <!-- Template for the root of the document -->
    <xsl:template match="/doc">
        <fo:root>
            <fo:layout-master-set>
                <!-- Cover page layout -->
                <fo:simple-page-master master-name="cover" page-height="297mm" page-width="210mm">
                    <fo:region-body display-align="center"  background-color="{color}"/>
                </fo:simple-page-master>

                <!-- Content page layout -->
                <fo:simple-page-master master-name="content" page-height="297mm" page-width="210mm">
                    <fo:region-body margin="20mm"/>
                </fo:simple-page-master>
            </fo:layout-master-set>

            <!-- Generate Cover Page -->
            <fo:page-sequence master-reference="cover">
                <fo:flow flow-name="xsl-region-body">
                    <!-- Cover Page Background Color -->
                    <fo:block height="100%" width="100%" text-align="center" space-before="50mm" >
                        <!-- Title -->
                        <fo:block font-size="36pt" font-weight="bold" color="white">
                            <xsl:value-of select="title"/>
                        </fo:block>
                        <!-- Author -->
                        <fo:block font-size="18pt" font-style="italic" color="white">
                            Assembled by <xsl:value-of select="author"/>
                        </fo:block>
                    </fo:block>
                </fo:flow>
            </fo:page-sequence>

            <!-- Table of Contents -->
            <fo:page-sequence master-reference="content">
                <fo:flow flow-name="xsl-region-body">
                    <fo:block font-size="18pt" font-weight="bold" text-align="center" space-after="20mm">
                        Table of Contents
                    </fo:block>

                    <!-- Loop through the headings and create the table of contents -->
                    <xsl:for-each select="content/heading">
                        <fo:block font-size="12pt" line-height="14pt" space-after="5mm">
                            <fo:inline>
                                <xsl:value-of select="."/>
                            </fo:inline>
                        </fo:block>
                    </xsl:for-each>
                </fo:flow>
            </fo:page-sequence>
        </fo:root>
    </xsl:template>

</xsl:stylesheet>
